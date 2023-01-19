import {
  ProfileFieldsFragment,
  Publication,
  ReactionType,
  usePublication,
  useReaction,
} from '@lens-protocol/react';

import { LoginButton } from '../components/auth/LoginButton';
import { WhenLoggedInWithProfile, WhenLoggedOut } from '../components/auth/auth';
import { Loading } from '../components/loading/Loading';
import { PublicationCard } from './components/PublicationCard';

type ReactionButtonProps = {
  publication: Publication;
  profileId: string;
  reactionType: ReactionType;
};

function ReactionButton({ publication, profileId, reactionType }: ReactionButtonProps) {
  const { addReaction, removeReaction, hasReaction, isPending, error } = useReaction({
    profileId,
  });

  const hasReactionType = hasReaction({
    reactionType,
    publication,
  });

  const toggleReaction = async () => {
    if (hasReactionType) {
      await removeReaction({
        reactionType,
        publication,
      });
    } else {
      await addReaction({
        reactionType,
        publication,
      });
    }
  };

  return (
    <>
      {error && <p>{error.message}</p>}
      <button onClick={toggleReaction} disabled={isPending}>
        <strong>{hasReactionType ? `Remove ${reactionType}` : `Add ${reactionType}`}</strong>
      </button>
    </>
  );
}

type ReactionInnerProps = {
  profile: ProfileFieldsFragment;
};

function ReactionInner({ profile }: ReactionInnerProps) {
  const { data: publication, loading: publicationLoading } = usePublication({
    publicationId: '0x1b-0x0118',
    observerId: profile.id, // important!
  });

  if (publicationLoading) return <Loading />;

  return (
    <div>
      <PublicationCard publication={publication} />
      <div>Total Upvotes: {publication.stats.totalUpvotes}</div>
      <div>
        <ReactionButton
          publication={publication}
          profileId={profile.id}
          reactionType={ReactionType.UPVOTE}
        />
      </div>
    </div>
  );
}

export function UseReaction() {
  return (
    <>
      <h1>
        <code>useReaction</code>
      </h1>
      <WhenLoggedInWithProfile>
        {({ profile }) => <ReactionInner profile={profile} />}
      </WhenLoggedInWithProfile>
      <WhenLoggedOut>
        <div>
          <p>You must be logged in to use this example.</p>
          <LoginButton />
        </div>
      </WhenLoggedOut>
    </>
  );
}