import Link from 'next/link';
interface Props {
  discordTag: string;
  description: string;
  avatarURL: string;
  slug: string;
}

const User = ({ discordTag, description, avatarURL, slug }: Props) => {
  return (
    <div
      className="column column-25"
      style={{
        background: '#f9f9f9',
        boxShadow: '0px 5px 10px rgba(0, 0, 0, .15)',
        borderRadius: 5,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <img
          src={avatarURL}
          alt=""
          style={{
            width: 128,
            height: 128,
            borderRadius: '100%',
            objectFit: 'cover',
          }}
          draggable={false}
        />
        <br />
        <br />
        <h3>{discordTag}</h3>
        <p>{description ? description : <em>No description provided.</em>}</p>
      </div>
      <Link href={`/profile/${slug}`}>
        <a className="button">Visit Profile</a>
      </Link>

      <style jsx>{`
        .column-25 {
          max-width: 100% !important;
        }

        @media screen and (min-width: 1024px) {
          .column-25 {
            max-width: 25%;
          }
        }
      `}</style>
    </div>
  );
};

export default User;
