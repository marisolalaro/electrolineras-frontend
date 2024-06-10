import { environment } from 'src/app/core/environments/environment';

export class DBAttributeName {

    // tabla client_user
    static tabClientUser_AttribName = 'names';
    static tabClientUser_AttribLastName = 'last_name';
    static tabClientUser_AttribMotherLastName = 'mother_last_name';
    static tabClientUser_AttribElectronicMail = 'electronic_mail';
    static tabClientUser_AttribChargeClientList = 'chargeClientList';
    static tabClientUser_AttribPaymentTransactionsElectrolineraList = 'paymentTransactionsElectrolineraList';

    // tabla payment_transactions_electrolinera
    static tabPaymentTransactions_AttribConsumer = 'consumer_name';
    static tabPaymentTransactions_AttribNombreRazonSocial = 'nombre_razon_social';
    static tabPaymentTransactions_AttribNumeroDocumentoConsumer = 'numero_documento';
    static tabPaymentTransactions_AttribEmailCliente = 'email_cliente';
    static tabPaymentTransactions_AttribAmount = 'amount';
    static tabPaymentTransactions_AttribRemainingAmount = 'remaining_amount';
    static tabPaymentTransactions_AttribFechaRegistro = 'fecha_registro';
    static tabPaymentTransactions_AttribExpiration = 'expiration_dt';
    static tabPaymentTransactions_AttribPaymentDateConsumer = 'payment_date';
    static tabPaymentTransactions_AttribGiftCard = 'gift_card_number';
    static tabPaymentTransactions_AttribQrImage = 'qr_image';

    // dom tabPayment
    static tabPaymentConsumerName = 'consumer_name';
    static tabPaymentNombreRazonSocial = 'nombre_razon_social';
    static tabPaymentDocumentoConsumer = 'numero_documento';
    static tabPaymentEmailCliente = 'email_cliente';
    static tabPaymentAmount = 'amount';
    static tabPaymentRemainingAmount = 'remaining_amount';
    static tabPaymentFechaRegistro = 'fecha_registro';
    static tabPaymentExpiration = 'expiration_dt';
    static tabPaymentPaymentDateConsumer = 'payment_date';
    static tabPaymentGiftCard = 'gift_card_number';
    static tabPaymentQrImage = 'qr_image';
};
