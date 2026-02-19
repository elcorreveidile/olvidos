import { getMemberAreaInfo } from "./MemberAreaLink";
import { MobileMemberLink } from "./MobileMemberLink";

interface MobileNavMemberLinkProps {
  onClose: () => void;
}

export async function MobileNavMemberLink({ onClose }: MobileNavMemberLinkProps) {
  const { href, label } = await getMemberAreaInfo();

  return <MobileMemberLink href={href} label={label} onClose={onClose} />;
}
