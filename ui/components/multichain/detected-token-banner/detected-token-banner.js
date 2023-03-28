import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18nContext } from '../../../hooks/useI18nContext';
import { getDetectedTokensInCurrentNetwork } from '../../../selectors';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
  MetaMetricsEventTokenSource,
} from '../../../../shared/constants/metametrics';
import { BannerAlert } from '../../component-library';

export const DetectedTokensBanner = ({
  className,
  actionButtonOnClick,
  ...props
}) => {
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);

  const detectedTokens = useSelector(getDetectedTokensInCurrentNetwork);
  const detectedTokensDetails = detectedTokens.map(
    ({ address, symbol }) => `${symbol} - ${address}`,
  );

  const handleOnClick = () => {
    actionButtonOnClick();
    trackEvent({
      event: MetaMetricsEventName.TokenImportClicked,
      category: MetaMetricsEventCategory.Wallet,
      properties: {
        source: MetaMetricsEventTokenSource.Detected,
        tokens: detectedTokensDetails,
      },
    });
  };
  return (
    <BannerAlert
      className={classNames('multichain-detected-token-banner', className)}
      actionButtonLabel={t('importTokensCamelCase')}
      actionButtonOnClick={handleOnClick}
      data-testid="detected-token-banner"
      {...props}
    >
      {detectedTokens.length === 1
        ? t('numberOfNewTokensDetectedSingular')
        : t('numberOfNewTokensDetectedPlural', [detectedTokens.length])}
    </BannerAlert>
  );
};

DetectedTokensBanner.propTypes = {
  /**
   * Handler to be passed to the DetectedTokenBanner component
   */
  actionButtonOnClick: PropTypes.func.isRequired,
  /**
   * An additional className to the DetectedTokenBanner component
   */
  className: PropTypes.string,
};
