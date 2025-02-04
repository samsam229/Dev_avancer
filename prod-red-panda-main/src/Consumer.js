const { Kafka } = require('kafkajs');

// Création du client Kafka
const kafka = new Kafka({
    clientId: 'consumer-app',
    brokers: ['localhost:19092'], // Adresse du broker RedPanda
});

// Création du consommateur
const consumer = kafka.consumer({ groupId: 'test-group' });

async function start() {
    // Connexion au consommateur
    await consumer.connect();
    console.log('Connexion réussie au broker.');

    // Abonnement au topic
    await consumer.subscribe({ topic: 'mon-super-topic', fromBeginning: true });
    console.log('Abonnement au topic "mon-super-topic" réussi.');

    // Consommation des messages
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const msgValue = message.value.toString(); // Récupérer la valeur du message
            const msgTimestamp = formatTimestamp(message.timestamp); // Formatage du timestamp

            // Affichage du message et du timestamp
            console.log(`Message reçu : ${msgValue}`);
            console.log(`Timestamp : ${msgTimestamp}`);
        },
    });
}

// Fonction pour convertir le timestamp au format dd/mm/yyyy à hh:mm
function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp)); // Conversion du timestamp en entier
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
}

// Lancer le consommateur
start().catch(console.error);
