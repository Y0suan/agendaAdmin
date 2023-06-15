import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      // Permitir todas las direcciones de correo electrónico
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // No se aplica ninguna comprobación de dirección de correo electrónico aquí
  // ya que ahora se permite cualquier dirección de correo electrónico
  // Puedes agregar lógica adicional aquí si es necesario.
}



// export async function getUsers() {
//   const adapter = await MongoDBAdapter.getAdapter(authOptions);
//   const users = await adapter.getUsers();
//   return users;
// }
