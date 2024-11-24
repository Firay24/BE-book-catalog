import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from './routes/users.route';
import { CategoryRoute } from './routes/categories.route';
import { BorrowRequestRoute } from './routes/borrowRequest.route';
import { BorrowedBookRoute } from './routes/borrowedBook.route';
import { BookRoute } from './routes/books.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new CategoryRoute(), new BookRoute(), new BorrowRequestRoute(), new BorrowedBookRoute()]);

app.listen();
