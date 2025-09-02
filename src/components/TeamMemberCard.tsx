import React from 'react';

interface TeamMemberCardProps {
  name: string;
  title: string;
  description: string;
  photoUrl: string;
  linkedinUrl: string;
}

export function TeamMemberCard({ name, title, description, photoUrl, linkedinUrl }: TeamMemberCardProps) {
  return (
    <div className="team-card">
      <img src={photoUrl} alt={name} className="team-card__photo" />
      <div className="team-card__title">
        {name} <br />
        <span>{title}</span>
      </div>
      <p className="team-card__descr">{description}</p>
      <div className="team-card__socials">
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="team-card__socials-btn linkedin">
          LinkedIn
        </a>
      </div>
    </div>
  );
}
