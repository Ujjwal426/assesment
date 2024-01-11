type PricingRules = { [key: string]: (quantity: number) => number };

enum Pricing {
  atvPricing = 109.5,
  ipdPricing = 549.99,
  mbpPricing = 1399.99,
  vgaPricing = 30.0,
}

class Checkout {
  private cart: { [key: string]: number } = {};
  private pricingRules: PricingRules;

  constructor(pricingRules: PricingRules) {
    this.pricingRules = pricingRules;
  }

  scan(item: string): void {
    this.cart[item] = (this.cart[item] || 0) + 1;
  }

  total(): number {
    let totalPrice = 0;
    for (const [item, quantity] of Object.entries(this.cart)) {
      const priceRule = this.pricingRules[item];
      totalPrice += priceRule ? priceRule(quantity) : 0;
    }
    return totalPrice;
  }
}

const pricingRules: PricingRules = {
  atv: (quantity) =>
    Math.floor(quantity / 3) * 2 * Pricing.atvPricing +
    (quantity % 3) * Pricing.atvPricing,
  ipd: (quantity) => (quantity > 4 ? 499.99 : Pricing.ipdPricing) * quantity,
  mbp: (quantity) => Pricing.mbpPricing * quantity,
  vga: (quantity) => Pricing.vgaPricing * quantity,
};

const checkout1 = new Checkout(pricingRules);
checkout1.scan("atv");
checkout1.scan("atv");
checkout1.scan("atv");
checkout1.scan("vga");
console.log("Total expected: $" + checkout1.total());

const checkout2 = new Checkout(pricingRules);
checkout2.scan("atv");
checkout2.scan("ipd");
checkout2.scan("ipd");
checkout2.scan("atv");
checkout2.scan("ipd");
checkout2.scan("ipd");
checkout2.scan("ipd");
console.log("Total expected: $" + checkout2.total());
