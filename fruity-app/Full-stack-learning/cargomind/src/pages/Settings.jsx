import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Shield, User, Palette, Save } from 'lucide-react';
import './Settings.css';

const SECTION = ({ title, icon: Icon, children, index }) => (
  <motion.div
    className="settings-section"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
  >
    <div className="ss-header">
      <Icon size={14} style={{ color: 'var(--accent)' }} />
      <h3>{title}</h3>
    </div>
    <div className="ss-body">{children}</div>
  </motion.div>
);

const Toggle = ({ label, desc, defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="setting-row">
      <div className="sr-info">
        <span className="sr-label">{label}</span>
        {desc && <span className="sr-desc">{desc}</span>}
      </div>
      <button className={`toggle ${on ? 'on' : ''}`} onClick={() => setOn(o => !o)}>
        <span className="toggle-thumb" />
      </button>
    </div>
  );
};

const SelectRow = ({ label, desc, options, defaultVal }) => {
  const [val, setVal] = useState(defaultVal || options[0]);
  return (
    <div className="setting-row">
      <div className="sr-info">
        <span className="sr-label">{label}</span>
        {desc && <span className="sr-desc">{desc}</span>}
      </div>
      <select value={val} onChange={e => setVal(e.target.value)} className="settings-select">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
};

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page">
      <div className="settings-grid">
        <SECTION title="Profile" icon={User} index={0}>
          <div className="profile-row">
            <div className="profile-avatar">AK</div>
            <div className="profile-fields">
              <div className="field-group">
                <label>Full Name</label>
                <input defaultValue="Aryan Kumar" className="settings-input" />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input defaultValue="aryan.kumar@cargomind.io" className="settings-input" />
              </div>
              <div className="field-group">
                <label>Role</label>
                <input defaultValue="Freight Manager" className="settings-input" />
              </div>
            </div>
          </div>
        </SECTION>

        <SECTION title="Notifications" icon={Bell} index={1}>
          <Toggle label="Shipment Delays" desc="Alert when any shipment is delayed" defaultOn={true} />
          <Toggle label="Customs Holds" desc="Notify on customs inspection triggers" defaultOn={true} />
          <Toggle label="Delivery Confirmations" desc="Notify when cargo is delivered" defaultOn={true} />
          <Toggle label="Rate Alerts" desc="Notify when freight rates change by ±10%" defaultOn={false} />
          <Toggle label="Weekly Summary" desc="Receive weekly performance digest" defaultOn={false} />
        </SECTION>

        <SECTION title="Regional & Currency" icon={Globe} index={2}>
          <SelectRow label="Default Currency" desc="Used in financial reports and cost tracking"
            options={['USD', 'EUR', 'GBP', 'CNY', 'SGD', 'AED']} defaultVal="USD" />
          <SelectRow label="Date Format" options={['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY']} defaultVal="YYYY-MM-DD" />
          <SelectRow label="Timezone" options={['UTC', 'Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Shanghai']} defaultVal="UTC" />
          <SelectRow label="Weight Unit" options={['KG', 'LBS']} />
        </SECTION>

        <SECTION title="Display" icon={Palette} index={3}>
          <Toggle label="Compact View" desc="Show more rows with reduced padding" />
          <Toggle label="Animations" desc="Enable smooth transitions and motion" defaultOn={true} />
          <Toggle label="Show Cargo Value" desc="Display financial values in shipment cards" defaultOn={true} />
          <SelectRow label="Default Page" options={['Dashboard', 'Shipments', 'Analytics']} />
        </SECTION>

        <SECTION title="Security" icon={Shield} index={4}>
          <Toggle label="Two-Factor Auth" desc="Require 2FA on login" />
          <Toggle label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" defaultOn={true} />
          <div className="setting-row">
            <div className="sr-info">
              <span className="sr-label">Change Password</span>
              <span className="sr-desc">Last changed 45 days ago</span>
            </div>
            <button className="settings-btn-outline">Update</button>
          </div>
          <div className="setting-row">
            <div className="sr-info">
              <span className="sr-label">API Keys</span>
              <span className="sr-desc">3 active integrations</span>
            </div>
            <button className="settings-btn-outline">Manage</button>
          </div>
        </SECTION>
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          <Save size={14} />
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
