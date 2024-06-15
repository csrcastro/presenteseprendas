export const loader = () => {
  const robotText = `google.com, pub-4878381663009681, DIRECT, f08c47fec0942fa0`;
  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
