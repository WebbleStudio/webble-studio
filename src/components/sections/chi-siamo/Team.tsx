'use client';

import React from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Vadim',
    role: 'Founder & Creative Director',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    name: 'Gabriele',
    role: 'Co-Founder & Technical Lead',
    color: 'bg-green-500',
  },
  {
    id: '3',
    name: 'Marco',
    role: 'Senior Developer',
    color: 'bg-purple-500',
  },
  {
    id: '4',
    name: 'Sofia',
    role: 'UX/UI Designer',
    color: 'bg-pink-500',
  },
];

export default function Team() {
  return (
    <section>
      <div className="w-full">
        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {teamMembers.map((member) => (
            <div key={member.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative w-full aspect-square overflow-hidden">
                {/* Placeholder Image */}
                <div
                  className={`w-full h-full ${member.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                >
                  <span className="text-white text-4xl md:text-5xl font-bold opacity-80">
                    {member.name.charAt(0)}
                  </span>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
