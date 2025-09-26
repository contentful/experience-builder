import { PrebindingManager } from './PrebindingManager';
import * as prebindingFixtures from './__fixtures__';

describe('PrebindingManager', () => {
  const patternEntryId = 'testPattern'; // not used right now, but kept for consistency with the original code
  beforeEach(() => {
    PrebindingManager.reset();
  });

  describe('Core functionality', () => {
    describe('Single pattern with prebinding definitions', () => {
      const l1Setup = () => {
        // Act
        PrebindingManager.storePrebindingDefinitions(
          prebindingFixtures.l1.nodeId,
          patternEntryId,
          prebindingFixtures.l1.prebindingDefinitions,
        );
      };

      it('should return empty if no prebinding definitions are processed', () => {
        expect(
          PrebindingManager.getParameterIdByNodeId(prebindingFixtures.l1.nodeId),
        ).toBeUndefined();
      });

      it('should process prebinding definitions correctly and return values', () => {
        // Arrange
        l1Setup();
        // Assert
        expect(PrebindingManager.getParameterIdByNodeId(prebindingFixtures.l1.nodeId)).toEqual(
          prebindingFixtures.l1.parameterId,
        );
      });

      describe('Nesting level 2 - pattern l2 nests l1 pattern multiple times', () => {
        const l2Setup = () => {
          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l2.nodeId,
            patternEntryId,
            prebindingFixtures.l2.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l2_l1_1.nodeId,
            patternEntryId,
            prebindingFixtures.l2_l1_1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l2_l1_2.nodeId,
            patternEntryId,
            prebindingFixtures.l2_l1_2.prebindingDefinitions,
          );
        };

        it('should process prebinding definitions correctly and return values', () => {
          // Arrange
          l2Setup();

          // Assert
          // l1 - root pattern
          expect(PrebindingManager.getParameterIdByNodeId(prebindingFixtures.l2.nodeId)).toEqual(
            prebindingFixtures.l2.parameterId,
          );

          // l2 - first version of pattern l1
          expect(
            PrebindingManager.getParameterIdByNodeId(prebindingFixtures.l2_l1_1.nodeId),
          ).toEqual(prebindingFixtures.l2_l1_1.parameterId);

          // l2 - second version of pattern l1
          expect(
            PrebindingManager.getParameterIdByNodeId(prebindingFixtures.l2_l1_2.nodeId),
          ).toEqual(prebindingFixtures.l2_l1_2.parameterId);
        });
      });

      describe('Nesting level 3 - pattern l3 nests l2 (containing l1 x2) pattern multiple times', () => {
        const newNodeIdForL3_l2_l1_1 = `${prebindingFixtures.l3_l2_1.nodeId}---0`;
        const newNodeIdForL3_l2_l1_2 = `${prebindingFixtures.l3_l2_1.nodeId}---1`;

        const newNodeIdForL3_l2_l1_3 = `${prebindingFixtures.l3_l2_2.nodeId}---0`;
        const newNodeIdForL3_l2_l1_4 = `${prebindingFixtures.l3_l2_2.nodeId}---1`;

        const l3Setup = () => {
          // Arrange
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_1,
            prebindingFixtures.l2_l1_1.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_2,
            prebindingFixtures.l2_l1_1.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_3,
            prebindingFixtures.l2_l1_2.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_4,
            prebindingFixtures.l2_l1_2.nodeId,
          );

          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l3.nodeId,
            patternEntryId,
            prebindingFixtures.l3.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l3_l2_1.nodeId,
            patternEntryId,
            prebindingFixtures.l3_l2_1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l3_l2_2.nodeId,
            patternEntryId,
            prebindingFixtures.l3_l2_1.prebindingDefinitions,
          );

          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_1,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_2,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_3,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_4,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );

          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l2_l1_1.nodeId,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            prebindingFixtures.l2_l1_2.nodeId,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
        };

        it('should process prebinding definitions correctly and return values', () => {
          // Arrange
          l3Setup();
          // Assert
          // l3 - root pattern
          expect(PrebindingManager.getParameterIdByNodeId(prebindingFixtures.l3.nodeId)).toEqual(
            prebindingFixtures.l3.parameterId,
          );

          // l3 - second version of pattern l2
          expect(
            PrebindingManager.getParameterIdByNodeId(prebindingFixtures.l3_l2_2.nodeId),
          ).toEqual(prebindingFixtures.l3_l2_2.parameterId);

          // l3 - first version of pattern l1 under l2_1
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_l1_1)).toEqual(
            prebindingFixtures.l3_l2_l1_1.parameterId,
          );

          // l3 - second version of pattern l1 under l2_1
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_l1_2)).toEqual(
            prebindingFixtures.l3_l2_l1_2.parameterId,
          );

          // l3_l2_l1_3 - first version of pattern l1 under l2_2
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_l1_3)).toEqual(
            prebindingFixtures.l3_l2_l1_3.parameterId,
          );

          // l3_l2_l1_4 - second version of pattern l1 under l2_2
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_l1_4)).toEqual(
            prebindingFixtures.l3_l2_l1_4.parameterId,
          );
        });

        it('should return a correct list of parameter ids and overwrites from getAllParameterDefinitionsForNodeId and getHoistedIdForParameterId', () => {
          l3Setup();

          // parameter definitions
          // for l3 it should return l3 parameter definitions (with copies from l2 and both l1 instances)
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(prebindingFixtures.l3.nodeId),
          ).toEqual(prebindingFixtures.l3.prebindingDefinitions[0].parameterDefinitions);
          // for l2 it should return l2 parameter definitions (with copies from both instances of l1) stored at l3 level
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(
              prebindingFixtures.l3_l2_1.nodeId,
            ),
          ).toEqual(prebindingFixtures.l3_l2_1.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(
              prebindingFixtures.l3_l2_2.nodeId,
            ),
          ).toEqual(prebindingFixtures.l3_l2_2.prebindingDefinitions[0].parameterDefinitions);
          // for l1 it should return parameter definitions for l1 stored at l3 level
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_1),
          ).toEqual(prebindingFixtures.l3_l2_l1_1.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_2),
          ).toEqual(prebindingFixtures.l3_l2_l1_2.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_3),
          ).toEqual(prebindingFixtures.l3_l2_l1_3.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_4),
          ).toEqual(prebindingFixtures.l3_l2_l1_4.prebindingDefinitions[0].parameterDefinitions);

          // overwrites
          // for l3 returns its own parameter ids as it's the topmost level pattern
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l3.parameterId,
              prebindingFixtures.l3.nodeId,
            ),
          ).toBe(prebindingFixtures.l3.parameterId);
          // for both instances of l2 returns respective parameter ids from copies stored on l3 level (matching the node id)
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l2.parameterId,
              prebindingFixtures.l3_l2_1.nodeId,
            ),
          ).toBe(prebindingFixtures.l3_l2_1.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l2.parameterId,
              prebindingFixtures.l3_l2_2.nodeId,
            ),
          ).toBe(prebindingFixtures.l3_l2_2.parameterId);
          // for l1 pattern, it returns the correct overwrite id from l3 level, that matches the instance nodeId
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_1,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_1.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_2,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_2.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_3,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_3.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_4,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_4.parameterId);
        });
      });

      describe('Nesting level 3 experience (creates an extra level of nesting to created node ids)', () => {
        const experienceNodeIdForL3 = 'test-exp-node-id-l3';

        const newNodeIdForL3_l2_1 = `${experienceNodeIdForL3}---0`;
        const newNodeIdForL3_l2_l1_1 = `${newNodeIdForL3_l2_1}---0`;
        const newNodeIdForL3_l2_l1_2 = `${newNodeIdForL3_l2_1}---1`;

        const newNodeIdForL3_l2_2 = `${experienceNodeIdForL3}---1`;
        const newNodeIdForL3_l2_l1_3 = `${newNodeIdForL3_l2_2}---0`;
        const newNodeIdForL3_l2_l1_4 = `${newNodeIdForL3_l2_2}---1`;

        const l3Setup = () => {
          // Arrange
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_1,
            prebindingFixtures.l3_l2_1.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_2,
            prebindingFixtures.l3_l2_2.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_1,
            prebindingFixtures.l2_l1_1.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_2,
            prebindingFixtures.l2_l1_1.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_3,
            prebindingFixtures.l2_l1_2.nodeId,
          );
          PrebindingManager.linkOriginalNodeIds(
            newNodeIdForL3_l2_l1_4,
            prebindingFixtures.l2_l1_2.nodeId,
          );
          PrebindingManager.storePrebindingDefinitions(
            experienceNodeIdForL3,
            patternEntryId,
            prebindingFixtures.l3.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_1,
            patternEntryId,
            prebindingFixtures.l2.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_2,
            patternEntryId,
            prebindingFixtures.l2.prebindingDefinitions,
          );

          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_1,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_2,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_3,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
          PrebindingManager.storePrebindingDefinitions(
            newNodeIdForL3_l2_l1_4,
            patternEntryId,
            prebindingFixtures.l1.prebindingDefinitions,
          );
        };

        it('should process prebinding definitions correctly and return values', () => {
          // Arrange
          l3Setup();
          // Assert
          // l3 - root pattern
          expect(PrebindingManager.getParameterIdByNodeId(experienceNodeIdForL3)).toEqual(
            prebindingFixtures.l3.parameterId,
          );

          // l3 - first version of pattern l2
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_1)).toEqual(
            prebindingFixtures.l3_l2_1.parameterId,
          );

          // l3 - second version of pattern l2
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_2)).toEqual(
            prebindingFixtures.l3_l2_2.parameterId,
          );

          // l3 - second version of pattern l1 under l2_1
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_l1_2)).toEqual(
            prebindingFixtures.l3_l2_l1_2.parameterId,
          );

          // l3_l2_l1_3 - first version of pattern l1 under l2_2
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_l1_3)).toEqual(
            prebindingFixtures.l3_l2_l1_3.parameterId,
          );

          // l3_l2_l1_4 - second version of pattern l1 under l2_2
          expect(PrebindingManager.getParameterIdByNodeId(newNodeIdForL3_l2_l1_4)).toEqual(
            prebindingFixtures.l3_l2_l1_4.parameterId,
          );
        });

        it('should return a correct list of parameter ids and overwrites from getAllParameterDefinitionsForNodeId and getHoistedIdForParameterId', () => {
          l3Setup();

          // parameter definitions
          // for l3 it should return l3 parameter definitions (with copies from l2 and both l1 instances)
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(experienceNodeIdForL3),
          ).toEqual(prebindingFixtures.l3.prebindingDefinitions[0].parameterDefinitions);
          // for l2 it should return l2 parameter definitions (with copies from both instances of l1) stored at l3 level
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_1),
          ).toEqual(prebindingFixtures.l3_l2_1.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_2),
          ).toEqual(prebindingFixtures.l3_l2_2.prebindingDefinitions[0].parameterDefinitions);
          // for l1 it should return parameter definitions for l1 stored at l3 level
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_1),
          ).toEqual(prebindingFixtures.l3_l2_l1_1.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_2),
          ).toEqual(prebindingFixtures.l3_l2_l1_2.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_3),
          ).toEqual(prebindingFixtures.l3_l2_l1_3.prebindingDefinitions[0].parameterDefinitions);
          expect(
            PrebindingManager.getAllParameterDefinitionsForNodeId(newNodeIdForL3_l2_l1_4),
          ).toEqual(prebindingFixtures.l3_l2_l1_4.prebindingDefinitions[0].parameterDefinitions);

          // overwrites
          // for l3 returns its own parameter ids as it's the topmost level pattern
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l3.parameterId,
              experienceNodeIdForL3,
            ),
          ).toBe(prebindingFixtures.l3.parameterId);
          // for both instances of l2 returns respective parameter ids from copies stored on l3 level (matching the node id)
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l2.parameterId,
              newNodeIdForL3_l2_1,
            ),
          ).toBe(prebindingFixtures.l3_l2_1.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l2.parameterId,
              newNodeIdForL3_l2_2,
            ),
          ).toBe(prebindingFixtures.l3_l2_2.parameterId);
          // for l1 pattern, it returns the correct overwrite id from l3 level, that matches the instance nodeId
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_1,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_1.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_2,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_2.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_3,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_3.parameterId);
          expect(
            PrebindingManager.getHoistedIdForParameterId(
              prebindingFixtures.l1.parameterId,
              newNodeIdForL3_l2_l1_4,
            ),
          ).toBe(prebindingFixtures.l3_l2_l1_4.parameterId);
        });
      });
    });
  });
});
