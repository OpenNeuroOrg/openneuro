import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/react"
import { useMutation } from "@apollo/client"
import { GET_USER, UPDATE_USER } from "../../queries/user"
import { RadioGroup } from "../../components/radio/RadioGroup"

export interface ProfilePrivacyProps {
  userId: string
  initialProfilePrivate: boolean
}

export const ProfilePrivacy: React.FC<ProfilePrivacyProps> = ({
  userId,
  initialProfilePrivate,
}) => {
  const initialValue = initialProfilePrivate ? "true" : "false"
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialProfilePrivate ? "true" : "false")
  }, [initialProfilePrivate])

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USER, variables: { userId } }],
    onError: (error) => {
      Sentry.captureException(error)
    },
  })

  const handleChange = async (newValue: string) => {
    setValue(newValue)
    try {
      await updateUser({
        variables: { id: userId, profilePrivate: newValue === "true" },
      })
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  const radioOptions = [
    { label: "Public", value: "false" },
    { label: "Private", value: "true" },
  ]

  return (
    <div>
      <p>
        Set your profile to private to hide your profile page from public view.
        Your datasets and contributions will still be visible based on each
        dataset's published state.
      </p>
      <RadioGroup
        name="profilePrivate"
        layout="row"
        radioArr={radioOptions}
        selected={value}
        setSelected={handleChange}
      />
    </div>
  )
}
