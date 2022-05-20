import dynamic from 'next/dynamic'
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword'

const ThirdPartyEmailPasswordAuthNoSSR = dynamic(
  new Promise<typeof ThirdPartyEmailPassword.ThirdPartyEmailPasswordAuth>((res) =>
    res(ThirdPartyEmailPassword.ThirdPartyEmailPasswordAuth)
  ),
  { ssr: false }
)

export default ThirdPartyEmailPasswordAuthNoSSR
