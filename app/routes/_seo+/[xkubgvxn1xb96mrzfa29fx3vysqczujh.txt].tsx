export const loader = () => {
  const robotText = `xkubgvxn1xb96mrzfa29fx3vysqczujh`;
  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
