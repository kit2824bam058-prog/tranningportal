import net from 'net';

const hosts = [
    'subincluster-shard-00-00.so8refv.mongodb.net',
    'subincluster-shard-00-01.so8refv.mongodb.net',
    'subincluster-shard-00-02.so8refv.mongodb.net'
];
const port = 27017;

hosts.forEach(host => {
    const socket = new net.Socket();
    console.log(`Testing ${host}:${port}...`);

    socket.setTimeout(5000);
    socket.on('connect', () => {
        console.log(`[SUCCESS] Connected to ${host}`);
        socket.destroy();
    });

    socket.on('error', (err) => {
        console.log(`[FAILED] ${host}: ${err.message}`);
    });

    socket.on('timeout', () => {
        console.log(`[TIMEOUT] ${host}`);
        socket.destroy();
    });

    socket.connect(port, host);
});
