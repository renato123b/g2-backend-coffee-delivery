import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId?: string) {
    if (userId) {
      const existingCart = await this.prisma.cart.findFirst({
        where: { userId },
        include: { items: true },
      });

      if (existingCart) {
        return existingCart;
      }
    }

    return this.prisma.cart.create({
      data: {
        userId: userId || null,
        status: 'Aguardando Pagamento',
        status_payment: 'Pendente',
      },
    });
  }

  async getCart(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            coffee: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const items = cart.items.map((item) => {
      const unitPrice = item.unitPrice.toNumber(); // Conversão segura
      return {
        id: item.id,
        coffee: {
          id: item.coffee.id,
          name: item.coffee.name,
          price: unitPrice,
          imageUrl: item.coffee.imageUrl,
        },
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    });

    const itemsTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = 10; // ou algum cálculo condicional
    const total = itemsTotal + shippingFee;
    const uniqueCategories = [...new Set(cart.items.map(i => i.coffeeId))]; // Ajustar se desejar por tag/categoria real

    return {
      id: cart.id,
      items,
      itemsTotal,
      uniqueCategories,
      shippingFee,
      total,
    };
  }

  async addItem(cartId: string, addItemDto: AddItemDto) {
    const { coffeeId, quantity } = addItemDto;

    if (quantity < 1 || quantity > 5) {
      throw new BadRequestException('Quantidade deve estar entre 1 e 5.');
    }

    const coffee = await this.prisma.coffee.findUnique({
      where: { id: coffeeId },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID ${coffeeId} not found`);
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        coffeeId,
      },
    });

    if (existingItem) {
      const newQuantity = Math.min(existingItem.quantity + quantity, 5);

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId,
        coffeeId,
        quantity,
        unitPrice: coffee.price,
      },
    });
  }

  async updateItem(
    cartId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
  ) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId,
      },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID ${itemId} not found in cart ${cartId}`,
      );
    }

    const { quantity } = updateItemDto;

    if (quantity < 1 || quantity > 5) {
      throw new BadRequestException('Quantidade deve estar entre 1 e 5.');
    }

    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
  }

  async removeItem(cartId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId,
      },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID ${itemId} not found in cart ${cartId}`,
      );
    }

    await this.prisma.cartItem.delete({
      where: { id: item.id },
    });

    return { message: 'Item removido com sucesso' };
  }
}
