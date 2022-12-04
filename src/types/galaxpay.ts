// Customer
export type Address = {
    city: string;
    complement: string;
    neighborhood: string;
    number: string;
    state: string;
    street: string;
    zipCode: string;
};

export type Customer = {
    Address: Address;
    ExtraFields: any[];
    createdAt: string;
    document: string;
    emails: string[];
    galaxPayId: string;
    invoiceHoldIss: string;
    municipalDocument: string;
    myId: string;
    name: string;
    phones: string[];
    updatedAt: string;
};

// PaymentMethodBoleto
export type Discount = {
    qtdDaysBeforePayDay: number;
    type: string;
    value: number;
};

export type PaymentMethodBoleto = {
    Discount: Discount;
    deadlineDays: number;
    fine: number | string;
    instructions: string;
    interest: number | string;
};

// Transaction
export type Boleto = {
    bankAccount: string;
    bankAgency: string;
    bankEmissor: string;
    bankLine: string;
    bankNumber: string | number;
    barCode: string;
    pdf: string;
};

export type Antifraud = {
    ip: string;
    sessionId: string;
    sent: boolean;
    approved: boolean;
};

export type Transaction = {
    Antifraud: Antifraud;
    Boleto: Boleto;
    ConciliationOccurrences: any[];
    additionalInfo: string;
    createdAt: string;
    fee: number;
    galaxPayId: string | number;
    installment: string | number;
    myId: string;
    payday: string;
    paydayDate: string;
    payedOutsideGalaxPay: boolean;
    status: string;
    statusDescription: string;
    subscriptionGalaxPayId: string | number;
    subscriptionMyId: string;
    value: number;
};

// Subscriptions
export type Subscriptions = {
    Customer: Customer;
    ExtraFields: any[];
    PaymentMethodBoleto: PaymentMethodBoleto;
    Transactions: Transaction[];
    additionalInfo: string;
    createdAt: string;
    firstPayDayDate: string;
    galaxPayId: string;
    mainPaymentMethodId: string;
    myId: string;
    paymentLink: string;
    periodicity: string;
    quantity: number;
    status: string;
    updatedAt: string;
    value: number;
};
