
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: './src/server.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
