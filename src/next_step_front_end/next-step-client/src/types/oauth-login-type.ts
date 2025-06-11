import UserType from "@/types/user-type.ts";

export default interface OauthLoginType {
    oauthLoginId: number;
    user: UserType;
    provider: string;
    providerUserId: string;
}
