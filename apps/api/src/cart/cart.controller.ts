import { Body, Controller, Inject, Post } from '@nestjs/common';
import { calculateCartBodySchema, type CalculateCartBody } from '@repo/schema-validation';

import { ZodValidationPipe } from '@/common/zod-validation.pipe';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(@Inject(CartService) private readonly cartService: CartService) {}

  @Post('calculate')
  calculate(@Body(new ZodValidationPipe(calculateCartBodySchema)) body: CalculateCartBody) {
    return this.cartService.calculate(body);
  }
}
