import { createClerkClient } from "@clerk/backend";
import { getAuth } from "@clerk/express";
import User from "../model/user.model.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

function mapClerkUser(clerkUser) {
  const email =
    clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;

  const fullName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email?.split("@")[0];

  return {
    clerkId: clerkUser.id,
    email,
    fullName,
    profilePic: clerkUser.imageUrl ?? "",
  };
}

export async function protectRoute(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      const profile = mapClerkUser(clerkUser);

      if (!profile.email || !profile.fullName) {
        res.status(400).json({ message: "Clerk user profile is incomplete" });
        return;
      }

      user = await User.findOneAndUpdate({ clerkId: userId }, profile, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
