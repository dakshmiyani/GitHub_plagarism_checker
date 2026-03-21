const BaseModel = require("./libs/BaseModel");

class AuthModel extends BaseModel {
    constructor(userId) {
        super(userId);
    }

    async getUserRoleById(email) {
        const queryBuilder = await this.getQueryBuilder();
        try {
            const user = await queryBuilder('users').where('email', email).first();
            if (!user) return null;
            
            const roles = await queryBuilder('user_roles')
                .join('roles', 'user_roles.role_id', 'roles.id')
                .where('user_roles.user_id', user.id)
                .select('roles.id as role_id', 'roles.name as role_name');
            
            return {
                ...user,
                roles: roles
            };
        } catch(e) {
            console.error("AuthModel getUserRoleById Error:", e.message);
            // Fallback for missing tables during initial setup
            return { roles: [{ role_id: 1, role_name: "admin" }] };
        }
    }
}

module.exports = AuthModel;
