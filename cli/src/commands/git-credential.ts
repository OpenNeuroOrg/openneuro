import { Command } from "@cliffy/command"
import { TextLineStream } from "@std/streams"
import { getConfig } from "../config.ts"

const prepareRepoAccess = `
  mutation prepareRepoAccess($datasetId: ID!) {
    prepareRepoAccess(datasetId: $datasetId) {
      token
      endpoint
    }
  }
`

interface GraphQLError {
  message: string
  locations: { line: number; column: number }[]
  path: string[]
  extensions: {
    code: string
    stacktrace: string[]
  }
}

export async function getRepoAccess(datasetId?: string, instance?: string) {
  const config = getConfig(instance)
  const req = await fetch(`${config.url}/crn/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.token}`, // Long lived token
    },
    body: JSON.stringify({
      query: prepareRepoAccess,
      variables: {
        datasetId,
      },
    }),
  })
  const response = await req.json()
  if (response.errors) {
    const errors: GraphQLError[] = response.errors
    throw Error(errors.map((error) => error.message).toString())
  } else {
    return {
      token: response.data.prepareRepoAccess.token, // Short lived repo access token
      endpoint: response.data.prepareRepoAccess.endpoint,
    }
  }
}

/**
 * Provide a git-credential helper for OpenNeuro
 */
export async function gitCredentialAction(
  instance: string,
  stdinReadable: ReadableStream<Uint8Array> = Deno.stdin.readable,
  tokenGetter = getRepoAccess,
) {
  let pipeOutput = ""
  const credential: Record<string, string | undefined> = {}
  // Create a stream of lines from stdin
  const lineStream = stdinReadable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
  for await (const line of lineStream) {
    const [key, value] = line.split("=", 2)
    credential[key] = value
  }
  if ("path" in credential && credential.path) {
    const datasetId = credential.path.split("/").pop()
    const { token } = await tokenGetter(datasetId, instance)
    const output: Record<string, string> = {
      username: "@openneuro/cli",
      password: token,
    }
    for (const key in output) {
      pipeOutput += `${key}=${output[key]}\n`
    }
  } else {
    throw new Error(
      "Invalid input from git, check the credential helper is configured correctly",
    )
  }
  return pipeOutput
}

export const gitCredential = new Command()
  .name("git-credential")
  .description(
    "A git credentials helper for easier datalad or git-annex access to datasets.",
  )
  .globalOption("-u, --url <url>", "OpenNeuro instance URL to use.", {
    default: "https://openneuro.org",
  })
  // Credentials here are short lived so store is not useful
  .command("store")
  .action(() => {})
  .command("get")
  .action(async (options) => {
    console.log(await gitCredentialAction(options.url))
  })
