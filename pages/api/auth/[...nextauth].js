import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			authorization: {
				params: {
					// I wish to request additional permission scopes.
					scope: "repo read:user user:email",
				},
			},
		}),
		// ...add more providers here
	],

	session: {
		// Use JSON Web Tokens for session instead of database sessions.
		// This option can be used with or without a database for users/accounts.
		// Note: `strategy` should be set to 'jwt' if no database is used.
		strategy: "jwt",

		// Seconds - How long until an idle session expires and is no longer valid.
		// maxAge: 30 * 24 * 60 * 60, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		// updateAge: 24 * 60 * 60, // 24 hours
	},

	callbacks: {
		async session({ session, user, token }) {
			// console.log("session callback");
			// console.log("session", session, "user", user, "token", token);

			session.accessToken = token.accessToken;
			return session;
		},
		async jwt({ token, user, account, profile, isNewUser }) {
			// console.log("jwt callback");

			// console.log(
			// 	"token",
			// 	token,
			// 	"user",
			// 	user,
			// 	"account",
			// 	account,
			// 	"profile",
			// 	profile,
			// 	"isNewUser",
			// 	isNewUser
			// );

			if (account) {
				token.accessToken = account.access_token;
			}

			return token;
		},
	},
});
