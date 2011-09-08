package edu.harvard.med.hcp.mcknight.web;

/**
 * @author Mark McKnight
 */
@SuppressWarnings("serial")
public class JGenerousException extends Exception
{
	public static enum LogLevel {ALL, NONE};

	private LogLevel logLevel = LogLevel.NONE;

    /**
     * Creates a new instance of <code>JGenerousException</code> without detail message.
     */
    public JGenerousException(LogLevel ll, String msg)
	{
		super(msg);
		logLevel = ll;
    }

    /**
     * Constructs an instance of <code>JGenerousException</code> with the specified detail message.
     * @param msg the detail message.
     */
    public JGenerousException(String msg)
	{
        super(msg);
    }

	public LogLevel getLogLevel()
	{
		return logLevel;
	}

	public void setLogLevel(LogLevel logLevel)
	{
		this.logLevel = logLevel;
	}
}
