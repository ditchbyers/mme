# Matchmaking enabled #

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), built as a real-time messaging service that connects gamers based on shared interests.

Hosted on [Vercel](https://vercel.com), it leverages powerful authentication via Clerk and real-time communication using Socket.IO.

---

## Getting Started (Local Development) ##

Follow these steps to set up the project locally on your machine:

### 1. Clone the Repository ###

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### 2. Install Dependencies ###

Ensure you're using **Node.js 22+**, then install dependencies:

```bash
npm install --force
```

> The `--force` flag resolves any potential peer dependency conflicts during installation.

### 3. Set Up Environment Variables ###

Create a `.env` file in the root directory and add the following variables. You can also find this information in the **video section** of the repository.

#### Required Environment Variables: ####

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_SOCKET_URL=
DEV_URL=
```

> Make sure to obtain the correct values from your Clerk and backend service configurations.

### 4. Start the Development Server ###

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

---

## Deploying to Vercel from Bitbucket ##

Deploying your Next.js app from Bitbucket to Vercel is straightforward:

### Step 1: Sign In to Vercel ###

- Go to [https://vercel.com](https://vercel.com)
- Log in or sign up using your **Bitbucket account**.

### Step 2: Import Your Bitbucket Repository ###

- Click **"Add New Project"**
- Select **Bitbucket** as your source
- Authorize access if prompted
- Choose the repository you want to deploy

### Step 3: Configure Build Settings ###

Vercel detects the framework automatically (Next.js), but confirm the following:

- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build`
- **Output Command**: `Next.js default`
- **Install Command**: `npm install --force`

### Step 4: Add Environment Variables ###

Before deployment, add the required environment variables under the **"Environment Variables"** section in the project settings.

Use the same variables listed in the `.env` file above.

### Step 5: Deploy ###

Click **"Deploy"**. Vercel will:

- Clone the repository
- Install dependencies
- Build the project
- Deploy to a live domain (e.g., `https://your-project-name.vercel.app`)

### Step 6: Set Up Custom Domains (Optional) ###

Under the **"Domains"** section in the Vercel dashboard, you can add custom domains and configure DNS settings.

---

## Learn More ##

- [Next.js Documentation](https://nextjs.org/docs) – Explore Next.js features and APIs
- [Vercel Documentation](https://vercel.com/docs) – Learn about deploying, hosting, and managing your app
- [Clerk Documentation](https://clerk.dev/docs) – Integrate user authentication and management
- [Socket.IO Documentation](https://socket.io/docs) – Real-time communication engine