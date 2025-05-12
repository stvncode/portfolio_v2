<div align="center">
<img alt="Portfolio" src="https://github.com/dillionverma/portfolio/assets/16860528/57ffca81-3f0a-4425-b31d-094f61725455" width="90%">
</div>

# Personal Portfolio

This is a modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## How to Customize This Portfolio

1. **Update Personal Information**:
   - Edit `src/data/resume.tsx` to add your personal information, work experience, education, skills, and projects.
   - Replace placeholder content with your actual information.

2. **Update Images**:
   - Add your profile picture and logo images to the `public` folder.
   - Update the `avatarUrl` field in `src/data/resume.tsx` to point to your image.
   - Add company/school logos to the `public` folder and update the paths in the resume data.

3. **Customize Projects**:
   - Add details about your projects in the projects section of `src/data/resume.tsx`.
   - Include links to live demos, repositories, and other relevant resources.
   - Add project images or videos if available.

4. **Update Social Links**:
   - Update the social media links in the contact section of `src/data/resume.tsx`.
   - Add or remove social platforms as needed.

5. **Customize or Remove Sections**:
   - If you don't have hackathon experience, you can remove or modify the hackathons section.
   - Customize the layout in `src/app/page.tsx` if needed.

## Running Locally

```bash
# Install dependencies
npm install
# or
yarn
# or
pnpm install

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

This portfolio can be easily deployed to platforms like Vercel, Netlify, or GitHub Pages.

## Credits

This portfolio template was originally created by [Dillion Verma](https://dillion.io).

# Features

- Setup only takes a few minutes by editing the [single config file](./src/data/resume.tsx)
- Built using Next.js 14, React, Typescript, Shadcn/UI, TailwindCSS, Framer Motion, Magic UI
- Includes a blog
- Responsive for different devices
- Optimized for Next.js and Vercel

# Getting Started Locally

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/dillionverma/portfolio
   ```

2. Move to the cloned directory

   ```bash
   cd portfolio
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the local Server:

   ```bash
   pnpm dev
   ```

5. Open the [Config file](./src/data/resume.tsx) and make changes

# License

Licensed under the [MIT license](https://github.com/dillionverma/portfolio/blob/main/LICENSE.md).
