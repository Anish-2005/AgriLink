import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Leaf } from 'lucide-react';

export default function ImpactCard({ walletData }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-100 rounded-3xl blur-2xl opacity-40 border-4 border-emerald-500"></div>
      <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-3 rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-emerald-700 font-bold uppercase tracking-wide">Your Impact Level</p>
            <p className="text-2xl font-extrabold text-emerald-800">{walletData?.level}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-extrabold text-emerald-800">Progress</span>
            <span className="font-extrabold text-emerald-800">{walletData?.progress}%</span>
          </div>
          <div className="w-full bg-emerald-100 border-2 border-emerald-300 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${walletData?.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="text-right text-sm mt-2 text-emerald-700 font-semibold">
            Next: {walletData?.nextLevel} ({walletData?.nextLevelTokens > 0 ? `+${walletData.nextLevelTokens}` : walletData?.nextLevelTokens} tokens)
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 rounded-2xl p-4">
          <p className="text-sm text-emerald-800 font-bold mb-2"><Leaf className="inline h-4 w-4 mr-2 text-emerald-600" />Your Environmental Impact</p>
          <p className="text-emerald-900 font-semibold">{walletData?.impact}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-lg font-extrabold text-emerald-800">{walletData?.lastMonthCO2 || 0}</div>
              <div className="text-xs text-emerald-700">Last month CO₂</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-extrabold text-emerald-800">+{walletData?.lastMonthTokens || 0}</div>
              <div className="text-xs text-emerald-700">Tokens earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
