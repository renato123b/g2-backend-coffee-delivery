import { Cart as PrismaCart } from '@prisma/client';

export class Cart implements PrismaCart {
  id: string;
  userId: string | null;
  status: string;
  status_payment: string;
  data_time_completed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
