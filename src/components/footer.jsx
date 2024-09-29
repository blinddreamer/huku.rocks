import { SiDocker } from "react-icons/si";
import { ImTwitter } from "react-icons/im";
import { IoMailSharp } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";

const SocialLink = ({ url, icon }) => (
  <a href={url} aria-label={icon.name}>
    {icon}
  </a>
);

const Footer = () => {
  return (
    <div class="flex-footer">
      <table>
        <tr>
          <SocialLink
            url="https://twitter.com/HukuA"
            icon={<ImTwitter />}
            label="Link to Twitter Icon"
          />
          <SocialLink
            url="https://hub.docker.com/u/blinddreamer"
            icon={<SiDocker />}
            label="Link to GitHub Icon"
          />
          <SocialLink
            url="https://github.com/blinddreamer/"
            icon={<FaGithub />}
            label="Link to Docker  Icon"
          />
          <SocialLink
            url="mailto:blinddreamer@huku.rocks"
            icon={<IoMailSharp />}
            label="Linik to Mail Icon"
          />
        </tr>
        <tr>
          <div id="copu">&copy; huku.rocks</div>
        </tr>
      </table>
    </div>
  );
};

export default Footer;
