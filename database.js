const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    async getTrustedUsers() {
        return await db.get('trustedUsers') || [];
    },
    async addTrustedUser(userId) {
        const users = await this.getTrustedUsers();
        if (!users.includes(userId)) {
            users.push(userId);
            await db.set('trustedUsers', users);
        }
    },
    async removeTrustedUser(userId) {
        let users = await this.getTrustedUsers();
        users = users.filter(id => id !== userId);
        await db.set('trustedUsers', users);
    }
};
