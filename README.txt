How to install the API with NestJS

1. Clone the Repository

git clone https://github.com/JohnnyHrince/book-library
cd your-repo-name

2️. Install Dependencies
npm install

3. Set Up Environment Variables
DATABASE_URL="postgresql://neondb_owner:*************@ep-green-paper-a9u8omt8-pooler.gwc.azure.neon.tech/library?sslmode=require"
# uncomment next line if you use Prisma <5.10
# DATABASE_URL_UNPOOLED="postgresql://neondb_owner:***************@ep-green-paper-a9u8omt8.gwc.azure.neon.tech/library?sslmode=require"

4. Generate Prisma Client
npx prisma generate

5. Run Migration
npx prisma migrate dev --name init

6. Start the Development Server
npm run start:dev

7. Running Tests
npm test