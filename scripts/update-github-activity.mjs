import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const username=process.env.GITHUB_USERNAME||'rohanmalhotracodes';
const now=new Date();
const year=now.getUTCFullYear();
const rangeStart=`${year}-01-01`;
const rangeEnd=now.toISOString().slice(0,10);
const endpoint=`https://github.com/users/${encodeURIComponent(username)}/contributions?from=${rangeStart}&to=${rangeEnd}`;
const response=await fetch(endpoint,{headers:{Accept:'text/html','User-Agent':'portfolio-activity-refresh'}});
if(!response.ok)throw new Error(`GitHub activity request failed: ${response.status}`);
const html=await response.text();

const contributionMatch=html.match(/<h2[^>]*id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s*contributions/i);
if(!contributionMatch)throw new Error('Could not read the contribution total');
const totalContributions=Number(contributionMatch[1].replaceAll(',',''));

const activityDays=new Map();
const dayPattern=/<td\b(?=[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})")(?=[^>]*\bdata-level="([0-4])")[^>]*>\s*<\/td>\s*<tool-tip[^>]*>([^<]+)<\/tool-tip>/gi;
for(const match of html.matchAll(dayPattern)){
  const countMatch=match[3].match(/([\d,]+) contributions?/i);
  activityDays.set(match[1],{level:Number(match[2]),count:countMatch?Number(countMatch[1].replaceAll(',','')):0});
}
if(!activityDays.size)throw new Error('Could not read contribution days');

const firstDay=new Date(`${rangeStart}T00:00:00Z`);
firstDay.setUTCDate(firstDay.getUTCDate()-firstDay.getUTCDay());
const days=[];
for(const cursor=new Date(firstDay);cursor<=now;cursor.setUTCDate(cursor.getUTCDate()+1)){
  const date=cursor.toISOString().slice(0,10);
  const activity=activityDays.get(date)||{level:0,count:0};
  days.push({date,...activity});
}

const overview=html.match(/\bContributed to\b([\s\S]*?)<\/div>\s*<\/div>/i)?.[1]||'';
const namedRepositories=(overview.match(/data-hovercard-type="repository"/g)||[]).length;
const otherRepositories=Number(overview.match(/and\s+([\d,]+)\s+other\s+repositories/i)?.[1]?.replaceAll(',','')||0);
const repositoryCount=namedRepositories+otherRepositories||null;

const encodedMix=html.match(/data-percentages="([^"]+)"/i)?.[1];
if(!encodedMix)throw new Error('Could not read the contribution mix');
const sourceMix=JSON.parse(encodedMix.replaceAll('&quot;','"').replaceAll('&#39;',"'"));
const mix={
  commits:Number(sourceMix.Commits)||0,
  pullRequests:Number(sourceMix['Pull requests'])||0,
  issues:Number(sourceMix.Issues)||0,
  codeReviews:Number(sourceMix['Code review'])||0
};

const output={username,year,rangeStart,rangeEnd,totalContributions,repositoryCount,mix,days};
const scriptDirectory=dirname(fileURLToPath(import.meta.url));
const outputPath=resolve(scriptDirectory,'../assets/data/github-activity.json');
await mkdir(dirname(outputPath),{recursive:true});
await writeFile(outputPath,`${JSON.stringify(output,null,2)}\n`);
console.log(`Updated ${days.length} calendar days through ${rangeEnd}.`);
