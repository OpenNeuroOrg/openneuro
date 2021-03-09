import fs from 'fs'

export const fixReactVirtualized = () => ({
  name: 'fix-react-virtualized-plugin',
  setup(build) {
    build.onLoad(
      {
        filter: /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/,
      },
      async args => {
        const text = await fs.promises.readFile(args.path, 'utf8')

        return {
          contents: text.replace(
            'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
            '',
          ),
        }
      },
    )
  },
})
