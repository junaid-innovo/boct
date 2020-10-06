import Head from "next/head";

const HeaderComp = () => {
  return (
    <Head>
      <title>Control Tower</title>
      <link rel="icon" href="/controltower.ico" />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />

      <link href="/test.css" rel="stylesheet" />
    </Head>
  );
};

export default HeaderComp;
