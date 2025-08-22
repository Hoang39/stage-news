import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            provider?: string;
            providerAccountId?: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        provider?: string;
        providerAccountId?: string;
    }
}
