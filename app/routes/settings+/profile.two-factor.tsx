import { Outlet } from '@remix-run/react'
import { type VerificationTypes } from '#app/routes/_auth+/verify.tsx'

export const twoFAVerificationType = '2fa' satisfies VerificationTypes

export default function TwoFactorRoute() {
	return <Outlet />
}
