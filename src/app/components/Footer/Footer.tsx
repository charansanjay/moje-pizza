import styles from './Footer.module.css';

import { Link } from 'react-router-dom';

/* icons/images */
import { TbSend } from 'react-icons/tb';
import { MdOutlinePhoneEnabled } from 'react-icons/md';
import { FaTwitter } from 'react-icons/fa';
import { FaMeta } from 'react-icons/fa6';
import { FaInstagram } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer data-testid='footer' className={styles.footerContainer}>
      <div data-testid="row" className={styles.footerMainContainer}>
        {/* Address */}
        <div data-testid="section" className={styles.footerSectionContainer}>
          <p className={styles.sectionHeading}>Address</p>
          <div className={styles.info}>
            <span>1234 Pizza Street</span>
            <span>City, State, 12345</span>
            <span>Country</span>
          </div>
        </div>

        {/* Opening-Hours */}
        <div data-testid="section" className={styles.footerSectionContainer}>
          <p className={styles.sectionHeading}>Opening / Hours</p>

          <div className={styles.info}>
            <span>
              <strong>Monday - Friday:</strong> 11am - 10pm
            </span>
            <span>
              <strong>Saturday - Sunday:</strong> 11am - 11pm
            </span>
          </div>
        </div>

        {/* Contact */}
        <div data-testid="section" className={styles.footerSectionContainer}>
          <p className={styles.sectionHeading}>Contact</p>

          <div className={styles.info}>
            <p className={styles.contact}>
              <strong>Phone:</strong>&nbsp;123-456-7890&nbsp;
              <MdOutlinePhoneEnabled className={styles.icon} />
            </p>
            <p className={styles.contact}>
              <strong>Email:</strong>&nbsp;abc@123.com&nbsp;
              <TbSend className={styles.icon} />
            </p>
          </div>
        </div>

        {/* Company */}
        <div data-testid="section" className={styles.footerSectionContainer}>
          <p className={styles.sectionHeading}>Company</p>

          <div className={styles.info}>
            <p className={styles.social}>
              <span className={styles.socialLinks}>About</span>
            </p>
            <p className={styles.social}>
              <span className={styles.socialLinks}>Privacy Policy</span>
            </p>
            <p className={styles.social}>
              <span className={styles.socialLinks}>Terms of Use</span>
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div data-testid="section" className={styles.footerSectionContainer}>
          <p className={styles.sectionHeading}>Follow Us</p>

          <div className={styles.info}>
            <p className={styles.social}>
              <span className={styles.socialLinks}>Facebook</span>&nbsp;&nbsp;
              <FaMeta className={styles.icon} />
            </p>
            <p className={styles.social}>
              <span className={styles.socialLinks}>Instagram</span>&nbsp;&nbsp;
              <FaInstagram className={styles.icon} />
            </p>
            <p className={styles.social}>
              <span className={styles.socialLinks}>Twitter</span>&nbsp;&nbsp;
              <FaTwitter className={styles.icon} />
            </p>
          </div>
        </div>
      </div>
      <div data-testid="row" className={styles.footerBottomContainer}>
        <Link data-testid="logo-link" className={styles.title} to='/'>
          Moje Pizza
        </Link>
        <div className={styles.creator}>
          <strong>Developed by - </strong>&nbsp;
          <a href='#' target='_blank'>
            Charan Singh Sanjay
          </a>
        </div>
        <div className={styles.copyRightContainer}>
          <p>© 2025 Moje Pizza</p>
        </div>
      </div>
    </footer>
  );
};
