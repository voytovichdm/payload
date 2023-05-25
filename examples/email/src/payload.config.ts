import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import Newsletter from './collections/Newsletter'
import Verify from './components/Verify'
import ResetPassword from './components/ResetPassword'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const mockModulePath = path.resolve(__dirname, './emptyModule.js')

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    components: {
      routes: [
        {
          path: '/verify',
          Component: Verify,
        },
        {
          path: '/reset-password',
          Component: ResetPassword,
        },
      ],
    },
    webpack: config => ({
      ...config,
      resolve: {
        ...config?.resolve,
        alias: [
          'fs',
          'handlebars',
          'inline-css',
          path.resolve(__dirname, './email/transport'),
          path.resolve(__dirname, './email/generateEmailHTML'),
          path.resolve(__dirname, './email/generateForgotPasswordEmail'),
          path.resolve(__dirname, './email/generateVerificationEmail'),
        ].reduce(
          (aliases, importPath) => ({
            ...aliases,
            [importPath]: mockModulePath,
          }),
          config.resolve.alias,
        ),
      },
    }),
  },
  collections: [
    Newsletter,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
