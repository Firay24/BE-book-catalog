import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { id: 'CWAB2IZZF6AUC4N1BRNT', name: 'admin' },
    { id: 'RWCDKDJP8WRH7UW1MJP6', name: 'member' },
  ];
  await prisma.role.createMany({
    data: roles.map(role => ({
      Id: role.id,
      Name: role.name,
    })),
  });

  const users = [
    { id: '5TSALDGSRXJ5FPGDYVHC', name: 'admin', email: 'admin@mail.com', password: 'book123', idRole: 'CWAB2IZZF6AUC4N1BRNT' },
    { id: '8LHSBMPX4LPJKN09STI6', name: 'member', email: 'member@mail.com', password: 'book123', idRole: 'RWCDKDJP8WRH7UW1MJP6' },
  ];
  const hashedUsers = await Promise.all(
    users.map(async user => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        Id: user.id,
        Email: user.email,
        Password: hashedPassword,
        Name: user.name,
        RoleId: user.idRole,
      };
    }),
  );
  await prisma.user.createMany({
    data: hashedUsers,
  });

  const categories = [
    { id: 'PP6QZJ989Q7HL60Z92HM', name: 'horror' },
    { id: 'C9N7LSOD75V8HF8G7CQJ', name: 'comedy' },
  ];
  await prisma.category.createMany({
    data: categories.map(category => ({
      Id: category.id,
      Name: category.name,
    })),
  });

  const books = [
    {
      id: 'DYBVXKXLH3CZWRIVOCT1',
      title: 'Tomie',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      url: '',
      releaseYear: 2020,
      price: 50000,
      totalPage: 200,
      thickness: 'tebal',
      categoryId: 'PP6QZJ989Q7HL60Z92HM',
    },
    {
      id: 'JYUDGESJHV958NF9OJZO',
      title: 'Human Capital',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      url: '',
      releaseYear: 2020,
      price: 120000,
      totalPage: 200,
      thickness: 'tebal',
      categoryId: 'C9N7LSOD75V8HF8G7CQJ',
    },
  ];
  await prisma.book.createMany({
    data: books.map(book => ({
      Id: book.id,
      Title: book.title,
      Description: book.description,
      ImageUrl: book.url,
      ReleaseYear: book.releaseYear,
      Price: book.price,
      TotalPage: book.totalPage,
      Thickness: book.thickness,
      CategoryId: book.categoryId,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: any) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
