import { Decimal } from '@prisma/client/runtime/library';

export class CartItem {
  id: string;
  cartId: string;
  coffeeId: string;
  quantity: number;
  unitPrice: Decimal;
  createdAt: Date;
  updatedAt: Date;

  // Campos computados ou populados via include
  coffee?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };

  subtotal?: number;
}
