const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const app = require('./app');

const server = http.createServer(app);
const dataFilePath = path.join(__dirname, 'tasks.json');

const request = (options, body) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                res.body = data;
                try {
                    res.body = JSON.parse(data);
                } catch (e) {}
                resolve(res);
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(body);
        }

        req.end();
    });
};

const runTests = async () => {
    server.listen(3000);

    let taskId;

    // Test de création de tâche
    let res = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/tasks',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, JSON.stringify({ title: 'Test Task', description: 'This is a test task' }));

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.title, 'Test Task');
    taskId = res.body.id;

    // Test de lecture de toutes les tâches
    res = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/tasks',
        method: 'GET'
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.some(task => task.id === taskId && task.title === 'Test Task'));

    // Redémarrer le serveur pour vérifier la persistance des données
    server.close();

    // Attendre un peu pour que le serveur se ferme complètement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Recharger les tâches depuis le fichier pour simuler un redémarrage du serveur
    tasks = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

    server.listen(3000);

    // Vérifier que la tâche est toujours présente après redémarrage
    res = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/tasks',
        method: 'GET'
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.some(task => task.id === taskId && task.title === 'Test Task'));

    // Test de mise à jour de la tâche
    res = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/tasks/${taskId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    }, JSON.stringify({ title: 'Updated Task' }));

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.title, 'Updated Task');

    // Test de suppression de la tâche
    res = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/tasks/${taskId}`,
        method: 'DELETE'
    });

    assert.strictEqual(res.statusCode, 204);

    // Test de lecture de la tâche supprimée
    res = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/tasks/${taskId}`,
        method: 'GET'
    });

    assert.strictEqual(res.statusCode, 404);

    console.log('All tests passed!');
    server.close();
};

runTests().catch(err => {
    console.error('Test failed:', err);
    server.close();
});