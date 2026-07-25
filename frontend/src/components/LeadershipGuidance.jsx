import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiCpu, FiPenTool, FiUsers } from 'react-icons/fi';

const teams = [
  {
    id: 1,
    title: 'Software Developers',
    badge: 'Software Engineering',
    icon: <FiCode className="w-6 h-6" />,
    glowColor: 'rgba(0, 229, 255, 0.25)',
    iconBg: 'from-cyan-500/20 to-blue-600/20',
    iconColor: '#00e5ff',
    badgeBg: 'rgba(0, 229, 255, 0.08)',
    badgeBorder: 'rgba(0, 229, 255, 0.2)',
    badgeText: '#00e5ff',
    description: 'Crafting modern web applications, scalable APIs, responsive interfaces, and enterprise software solutions.',
    members: [
      { name: 'Sadhana', role: 'Frontend Developer' },
      { name: 'Dharun', role: 'Backend Developer' },
      { name: 'Vazhith', role: 'Software Developer' }
    ],
    expertise: ['React.js', 'Node.js & Express', 'REST APIs', 'Full-Stack Dev']
  },
  {
    id: 2,
    title: 'IoT Developers',
    badge: 'IoT Systems',
    icon: <FiCpu className="w-6 h-6" />,
    glowColor: 'rgba(52, 211, 153, 0.25)',
    iconBg: 'from-emerald-500/20 to-teal-600/20',
    iconColor: '#34d399',
    badgeBg: 'rgba(52, 211, 153, 0.08)',
    badgeBorder: 'rgba(52, 211, 153, 0.2)',
    badgeText: '#34d399',
    description: 'Building smart connected devices, sensor automation, embedded hardware integration, and edge computing networks.',
    members: [
      { name: 'Shanjai Kumar', role: 'IoT Engineer' },
      { name: 'Ajith', role: 'Embedded Systems' },
      { name: 'Harinisha', role: 'IoT Developer' }
    ],
    expertise: ['Embedded Systems', 'Sensor Networks', 'Edge Computing', 'IoT Architecture']
  },
  {
    id: 3,
    title: 'Creative Designers',
    badge: 'Design & Creative',
    icon: <FiPenTool className="w-6 h-6" />,
    glowColor: 'rgba(251, 113, 133, 0.25)',
    iconBg: 'from-rose-500/20 to-orange-600/20',
    iconColor: '#fb7185',
    badgeBg: 'rgba(251, 113, 133, 0.08)',
    badgeBorder: 'rgba(251, 113, 133, 0.2)',
    badgeText: '#fb7185',
    description: 'Designing intuitive UI/UX interfaces, brand identities, design systems, and engaging visual digital experiences.',
    members: [
      { name: 'Shivaprakash', role: 'UI/UX Design Lead' },
      { name: 'Sridevi', role: 'Visual Designer' },
      { name: 'Harinisha', role: 'Product Designer' }
    ],
    expertise: ['UI/UX Design', 'Design Systems', 'Brand Identity', 'Visual Assets']
  }
];

const LeadershipGuidance = () => {
  return (
    <section id="leadership" className="relative py-20 z-10 overflow-hidden" style={{ background: 'linear-gradient(180deg, #030712 0%, #0a1628 100%)' }}>
      {/* Background ambient highlights matching website theme */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Heading */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-5"
              style={{
                background: 'rgba(0,229,255,0.1)',
                border: '1px solid rgba(0,229,255,0.2)',
                color: '#00e5ff',
              }}
            >
              Our Experts & Teams
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Meet Our Dedicated{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #00e5ff 0%, #2563eb 50%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Development Teams
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Our specialized domain teams collaborate seamlessly across Software, IoT, and Creative Design to build world-class solutions for Sensor Grid.
          </motion.p>
        </div>

        {/* 3 Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.45) 100%)',
                border: '1px solid rgba(0,229,255,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Outer Hover Glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `0 0 40px ${team.glowColor}, inset 0 0 30px ${team.glowColor}`,
                }}
              />

              {/* Top Border Accent Glow Line */}
              <div
                className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl"
                style={{
                  background: `linear-gradient(90deg, transparent, ${team.iconColor}, transparent)`,
                }}
              />

              <div className="relative z-10">
                {/* Header: Icon & Domain Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${team.iconBg} flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform duration-300`}
                    style={{ color: team.iconColor, boxShadow: `0 0 15px ${team.glowColor}` }}
                  >
                    {team.icon}
                  </div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: team.badgeBg,
                      border: `1px solid ${team.badgeBorder}`,
                      color: team.badgeText,
                    }}
                  >
                    {team.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {team.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {team.description}
                </p>

                {/* Team Members List */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FiUsers className="w-3.5 h-3.5 text-cyan-400" />
                    Team Members
                  </h4>
                  <div className="space-y-2.5">
                    {team.members.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: team.iconColor }}
                          />
                          <span className="text-sm font-bold text-white">{member.name}</span>
                        </div>
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            background: team.badgeBg,
                            border: `1px solid ${team.badgeBorder}`,
                            color: team.badgeText,
                          }}
                        >
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                    Core Focus Area
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {team.expertise.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-300"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipGuidance;
