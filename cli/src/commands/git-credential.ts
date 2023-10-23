import { Command, TextLineStream } from '../deps.ts'

const prepareRepoAccess = `
  mutation prepareRepoAccess($datasetId: ID!) {
    prepareRepoAccess(datasetId: $datasetId) {
      token
      endpoint
    }
  }
`

export function getRepoToken(datasetId?: string) {
  /*
  return client
    .mutate({
      mutation: prepareRepoAccess,
      variables: {
        datasetId,
      },
    })
    .then(({ data }) => data.prepareRepoAccess.token)
    */
  return 'token'
}

/**
 * Provide a git-credential helper for OpenNeuro
 */
export async function gitCredentialAction(
  stdinReadable: ReadableStream<Uint8Array> = Deno.stdin.readable,
  tokenGetter = getRepoToken,
) {
  let pipeOutput = ''
  const credential: Record<string, string | undefined> = {}
  // Create a stream of lines from stdin
  const lineStream = stdinReadable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
  for await (const line of lineStream) {
    const [key, value] = line.split('=', 2)
    credential[key] = value
  }
  if ('path' in credential && credential.path) {
    const datasetId = credential.path.split('/').pop()
    const token = await tokenGetter(datasetId)
    const output: Record<string, string> = {
      username: '@openneuro/cli',
      password: token,
    }
    for (const key in output) {
      pipeOutput += `${key}=${output[key]}\n`
    }
  } else {
    throw new Error(
      'Invalid input from git, check the credential helper is configured correctly',
    )
  }
  return pipeOutput
}

export const gitCredential = new Command()
  .name('git-credential')
  .description(
    'A git credentials helper for easier datalad or git-annex access to datasets.',
  )
  .action(() => {
    console.log(gitCredentialAction())
  })
