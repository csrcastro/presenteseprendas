import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { gdprConsent } from '~/cookies';

export const loader: LoaderFunction = async () => {
  return json('Not allowed', { status: 403 });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await gdprConsent.parse(cookieHeader)) || {};

  const redirectUrl = formData.get('redirectUrl');

  if (formData.get('accept-gdpr') === 'true') {
    cookie.gdprConsent = true;
  }

  console.log(redirectUrl);

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await gdprConsent.serialize(cookie),
      },
    }
  );
};
