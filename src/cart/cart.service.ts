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

    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        coffee: {
          id: item.coffee.id,
          name: item.coffee.name,
          price: item.unitPrice,
        },
        quantity: item.quantity,
        subtotal: item.unitPrice.toNumber() * item.quantity

      })),
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

    // Verifica se o item já está no carrinho
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        coffeeId,
      },
    });

    if (existingItem) {
      // Se já existir, atualiza a quantidade (até o limite de 5)
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
