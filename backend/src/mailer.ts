import nodemailer from "nodemailer";

type MailItem = {
  name: string;
  quantity: number;
  subtotal: number;
};

export async function sendOrderConfirmationEmail(input: {
  email: string;
  saleId: number;
  items: MailItem[];
  total: number;
}): Promise<void> {
  const transporter = nodemailer.createTransport({ jsonTransport: true });

  const lines = input.items
    .map(
      (item) =>
        `- ${item.name}: ${item.quantity} x (subtotal R$ ${item.subtotal.toFixed(2)})`,
    )
    .join("\n");

  const info = await transporter.sendMail({
    from: "no-reply@lojavirtual.local",
    to: input.email,
    subject: `Pedido confirmado #${input.saleId}`,
    text: [
      `Seu pedido #${input.saleId} foi concluido com sucesso.`,
      "",
      "Itens:",
      lines,
      "",
      `Total: R$ ${input.total.toFixed(2)}`,
    ].join("\n"),
  });

  console.log("Email de confirmacao gerado:", info.message);
}
