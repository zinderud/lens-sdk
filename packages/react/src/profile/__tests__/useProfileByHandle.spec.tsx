import {
  createMockApolloClientWithMultipleResponses,
  mockGetProfileByHandleQueryMockedResponse,
  mockProfileFieldsFragment,
} from '@lens-protocol/api/mocks';
import { waitFor } from '@testing-library/react';

import { renderHookWithMocks } from '../../__helpers__/testing-library';
import { useProfileByHandle } from '../useProfileByHandle';
import { ProfileFieldsFragment } from '../useProfilesToFollow';

describe('Given the useProfileByHandle hook', () => {
  const handle = 'aave.lens';
  const mockProfile: ProfileFieldsFragment = mockProfileFieldsFragment({ handle });

  describe('when the query returns data successfully', () => {
    it('should return profile', async () => {
      const { result } = renderHookWithMocks(() => useProfileByHandle({ handle }), {
        mocks: {
          apolloClient: createMockApolloClientWithMultipleResponses([
            mockGetProfileByHandleQueryMockedResponse({ profile: mockProfile, handle }),
          ]),
        },
      });

      await waitFor(() => expect(result.current.loading).toBeFalsy());

      expect(result.current.data).toEqual(mockProfile);
    });
  });
});