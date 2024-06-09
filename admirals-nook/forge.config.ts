import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { PublisherGithub } from '@electron-forge/publisher-github';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    icon: './icons/ChestIcon'
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({})],
  publishers: [new PublisherGithub({
    draft: true,
    repository: {
      name: 'POE-AdmiralsNook',
      owner: 'LawTotem'
    }
  })],
  plugins: [
    new WebpackPlugin({
      devContentSecurityPolicy: 'img-src *',
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/settings/settings.html',
            js: './src/settings/renderer.ts',
            name: 'settings_window',
            preload: {
              js: './src/settings/preload.ts',
            },
          },
          {
            html: './src/inventory/inventoryview.html',
            js: './src/inventory/renderer.ts',
            name: 'inventory_view_window',
            preload: {
              js: './src/inventory/preload.ts'
            }
          },
          {
            html: './src/search_edit/searchedit.html',
            js: './src/search_edit/renderer.ts',
            name: 'search_edit_window',
            preload: {
              js: './src/search_edit/preload.ts'
            }
          },
          {
            html: './src/itemview/itemview.html',
            js: './src/itemview/renderer.ts',
            name: 'item_view_window',
            preload: {
              js: './src/itemview/preload.ts'
            }
          }
        ],
      },
    }),
  ],
};

export default config;
