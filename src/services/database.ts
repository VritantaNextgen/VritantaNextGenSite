import { v4 as uuidv4 } from 'uuid';
import Supabase from './supabase';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  displayName?: string;
  role: 'customer' | 'admin' | 'superadmin';
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  isActive?: string;
}

export class SupabaseDatabase {
  // Collection name constants
  public static readonly USERS_TABLE = 'users';

  // Users table operations
  users = {
    list: async ({ where, limit }: { where: Record<string, any>; limit?: number }) => {
let query = Supabase
        .from('users')
        .select('*');

      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    create: async (data: Omit<User, 'id'>) => {
        const { data: user, error } = await Supabase
        .from(SupabaseDatabase.USERS_TABLE)
        .insert([{
          ...data,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return user[0];
    },

    update: async (id: string, data: Partial<User>) => {
      const { data: user, error } = await Supabase
              .from(SupabaseDatabase.USERS_TABLE)
              .update({
                ...data,
                updated_at: new Date().toISOString()
              })
              .eq('id', id)
              .select();

      if (error || !user) throw new Error(`User with id ${id} not found`);
      return user[0];
    },

    delete: async (id: string) => {
      const { error } = await Supabase
              .from(SupabaseDatabase.USERS_TABLE)
              .delete()
              .eq('id', id);

      if (error) throw error;
      return { success: true };
    }
  };

  // Projects table operations
  projects = {
    list: async ({ where, limit }: { where?: Record<string, any>; limit?: number }) => {
      let query = Supabase.from('projects').select('*');
      if (where) Object.entries(where).forEach(([key, value]) => { query = query.eq(key, value); });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (data: any) => {
      const { data: project, error } = await Supabase.from('projects').insert([{ ...data, id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select();
      if (error) throw error;
      return project[0];
    },
    update: async (id: string, data: any) => {
      const { data: project, error } = await Supabase.from('projects').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select();
      if (error || !project) throw new Error(`Project with id ${id} not found`);
      return project[0];
    },
    delete: async (id: string) => {
      const { error } = await Supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
  };

  // Tools table operations
  tools = {
    list: async ({ where, limit }: { where?: Record<string, any>; limit?: number }) => {
      let query = Supabase.from('tools').select('*');
      if (where) Object.entries(where).forEach(([key, value]) => { query = query.eq(key, value); });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (data: any) => {
      const { data: tool, error } = await Supabase.from('tools').insert([{ ...data, id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select();
      if (error) throw error;
      return tool[0];
    },
    update: async (id: string, data: any) => {
      const { data: tool, error } = await Supabase.from('tools').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select();
      if (error || !tool) throw new Error(`Tool with id ${id} not found`);
      return tool[0];
    },
    delete: async (id: string) => {
      const { error } = await Supabase.from('tools').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
  };

  // UserTools table operations
  userTools = {
    list: async ({ where, limit }: { where?: Record<string, any>; limit?: number }) => {
      let query = Supabase.from('user_tools').select('*');
      if (where) Object.entries(where).forEach(([key, value]) => { query = query.eq(key, value); });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (data: any) => {
      const { data: userTool, error } = await Supabase.from('user_tools').insert([{ ...data, id: uuidv4(), created_at: new Date().toISOString() }]).select();
      if (error) throw error;
      return userTool[0];
    },
    update: async (id: string, data: any) => {
      const { data: userTool, error } = await Supabase.from('user_tools').update({ ...data }).eq('id', id).select();
      if (error || !userTool) throw new Error(`UserTool with id ${id} not found`);
      return userTool[0];
    },
    delete: async (id: string) => {
      const { error } = await Supabase.from('user_tools').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
  };

  // BlogPosts table operations
  blogPosts = {
    list: async ({ where, limit }: { where?: Record<string, any>; limit?: number }) => {
      let query = Supabase.from('blog_posts').select('*');
      if (where) Object.entries(where).forEach(([key, value]) => { query = query.eq(key, value); });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (data: any) => {
      const { data: post, error } = await Supabase.from('blog_posts').insert([{ ...data, id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select();
      if (error) throw error;
      return post[0];
    },
    update: async (id: string, data: any) => {
      const { data: post, error } = await Supabase.from('blog_posts').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select();
      if (error || !post) throw new Error(`BlogPost with id ${id} not found`);
      return post[0];
    },
    delete: async (id: string) => {
      const { error } = await Supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
  };

  // Workflows table operations
  workflows = {
    list: async ({ where, limit }: { where?: Record<string, any>; limit?: number }) => {
      let query = Supabase.from('workflows').select('*');
      if (where) Object.entries(where).forEach(([key, value]) => { query = query.eq(key, value); });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (data: any) => {
      const { data: workflow, error } = await Supabase.from('workflows').insert([{ ...data, id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select();
      if (error) throw error;
      return workflow[0];
    },
    update: async (id: string, data: any) => {
      const { data: workflow, error } = await Supabase.from('workflows').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select();
      if (error || !workflow) throw new Error(`Workflow with id ${id} not found`);
      return workflow[0];
    },
    delete: async (id: string) => {
      const { error } = await Supabase.from('workflows').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
  };

  // AIAgents table operations
  aiAgents = {
    list: async ({ where, limit }: { where?: Record<string, any>; limit?: number }) => {
      let query = Supabase.from('ai_agents').select('*');
      if (where) Object.entries(where).forEach(([key, value]) => { query = query.eq(key, value); });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (data: any) => {
      const { data: agent, error } = await Supabase.from('ai_agents').insert([{ ...data, id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select();
      if (error) throw error;
      return agent[0];
    },
    update: async (id: string, data: any) => {
      const { data: agent, error } = await Supabase.from('ai_agents').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select();
      if (error || !agent) throw new Error(`AIAgent with id ${id} not found`);
      return agent[0];
    },
    delete: async (id: string) => {
      const { error } = await Supabase.from('ai_agents').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
  };
}

const db = new SupabaseDatabase();
export default db;
